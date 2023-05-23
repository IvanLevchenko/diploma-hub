package main

import (
	"fmt"
	pdf "main/main.go/read-pdf"
	"math"
	"os"
	"strings"
	"sync"
)

var wg sync.WaitGroup

func main() {
	pivotFile := os.Args[1] // Getting file, that will be checked
	filesForCheck := os.Args[2:] // Getting existing files
	var passed bool

	if len(filesForCheck) == 1 && filesForCheck[0] == pivotFile { // If there is only pivot itself then just return "true"
		fmt.Printf("%t;%d", true, 0)
		return
	}
	
	const splitBySentences = ". " // Symbol for splitting files by sentences

	pivotFileContent, err := pdf.ReadPdf(pivotFile) // Content from pivot file
	pivotFileBySentences := strings.Split(pivotFileContent, splitBySentences) // Splittet by sentences

	controlChannel := make(chan int) // If this channel closed, then we are stopping our program and returning result
	results := make(chan int, 4) // This channel will contain all calculated results for files
	done := false // If "done" == true, then we will break the loop
	
	for _, file := range filesForCheck {
		if done {
			break
		}

		if file == pivotFile {
			continue
		}

		if err != nil {
			panic(err)
		}
		
		currentFileContent, err := pdf.ReadPdf(file)
		
		if err != nil {
			panic(err)
		}
		
		currentFileBySentences := strings.Split(currentFileContent, splitBySentences)
		
		wg.Add(1)
		go verify(controlChannel, results, pivotFileBySentences, currentFileBySentences, &done)
	}
	
	wg.Wait()

	resultLen := len(results)
	var percent int

	for i := 0; i < resultLen; i++ {
		if percent > 20 {
			continue
		}

		percent = <- results

		if percent > 20 {
			passed = false
		} else {
			passed = true // If percent of similar sentences is less than 20, we are considering that file "passed" 
		}
	}
	
	fmt.Printf("%t;%d", passed, int(math.Round(float64(percent)))) // Printing result to receive it from stdout in NodeJs
}

func verify(controlChannel chan int, results chan int, pivotFileBySentences []string, currentFileBySentences []string, done *bool) {
	if *done {
		return
	}
	defer wg.Done()

	const maxRowLength = 50
	similarityCount := 0
	pivotSentencesAmount := 0

	for _, ps := range pivotFileBySentences {
		if (len(strings.TrimSpace(ps)) < maxRowLength) || (strings.Contains(ps, "http") || strings.Contains(ps, "https")) {
			continue
		}
		pivotSentencesAmount++

		for _, cs := range currentFileBySentences {
			if (len(strings.TrimSpace(cs)) < maxRowLength) || (strings.Contains(ps, "http") || strings.Contains(ps, "https")) {
				continue
			}
			
			if cs == ps {
				similarityCount++ 
			}
		}
	}

	plagiarismPercent := similarityCount * 100 / pivotSentencesAmount // Calculating percent of identical sentences

	results <- plagiarismPercent // Sending result to channel

	if plagiarismPercent > 20 { // If percent of identical sentences is already than 20%, then we are stopping the program 
		*done = true
		close(controlChannel)
	}
}
