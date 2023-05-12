import sys
import base64
import fitz

# Getting pdf file path from stdin args
input_file = sys.argv[-1]

# Opening of a file
file_handle = fitz.open(input_file)

# Getting 1st page from pdf
page = file_handle[0]

# Making png image from 1st page
page_image = page.get_pixmap()

# Decoding png image to base64
base64_from_bytes = base64.b64encode(page_image.tobytes()).decode("ascii")

# Printing and flushing base64 in order to give NodeJS the result
print(base64_from_bytes)
sys.stdout.flush()
