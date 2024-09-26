package com.zendrive.api;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import java.io.File;

public class TesseractTest {
	public static void main(String[] args) throws TesseractException {
		Tesseract tesseract = new Tesseract();
		tesseract.setDatapath("/usr/local/Cellar/tesseract/5.4.1/share/tessdata/");
		var out = tesseract.doOCR(new File("/Users/admin/Documents/ocr/2rb88.png"));
		System.out.println(out);
	}
}
