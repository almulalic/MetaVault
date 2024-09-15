import sys
import base64
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.parsers.plaintext import PlaintextParser


def summarize_text(text):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, 2)  # Summarize to 2 sentences
    return ' '.join([str(sentence) for sentence in summary])


if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = base64.b64decode(sys.argv[1]).decode('utf-8')
        summary = summarize_text(text)
        print(base64.b64encode(summary.encode('utf-8')).decode('utf-8'))
    else:
        print("No text input provided.")
