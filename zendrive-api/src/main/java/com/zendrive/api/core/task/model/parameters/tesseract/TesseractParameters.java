package com.zendrive.api.core.task.model.parameters.tesseract;

import lombok.*;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class TesseractParameters {
	private String language = "eng";
	private int pageSegModel = 1;
	private int ocrEngineModel = 1;
}
