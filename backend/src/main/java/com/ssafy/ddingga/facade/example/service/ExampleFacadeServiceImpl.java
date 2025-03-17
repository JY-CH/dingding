package com.ssafy.ddingga.facade.example.service;

import com.ssafy.ddingga.domain.example.entity.Example;
import com.ssafy.ddingga.domain.example.service.ExampleServiceImpl;
import com.ssafy.ddingga.facade.example.dto.ExamplePostRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ExampleFacadeServiceImpl implements ExampleFacadeService {

    private final ExampleServiceImpl exampleService;

    @Override
    public void createExample(ExamplePostRequestDto request) {
        Example example = Example.builder()
                .description(request.getDescription())
                .integerId(request.getIntegerId())
                .build();
        exampleService.createExample(example);
    }
}
