package com.zendrive.api.rest.model.dto.token;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class representing a response containing refresh token information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "Builder", builderClassName = "Builder", setterPrefix = "with")
public class RefreshTokenResponse {

  /**
   * The access token.
   */
  private String accessToken;

  /**
   * The refresh token.
   */
  private String refreshToken;
}
