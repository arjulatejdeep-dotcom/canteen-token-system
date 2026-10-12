package com.campus.canteen.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveDisplayResponse {
    private List<String> preparingTokens;
    private List<String> readyTokens;
}
