package com.ssafy.ddingga.domain.example.service;

import com.ssafy.ddingga.domain.example.entity.Example;
import com.ssafy.ddingga.domain.example.repository.ExampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ExampleServiceImpl implements ExampleService {
    private final ExampleRepository exampleRepository;

    @Override
    public void createExample(Example example) {
        exampleRepository.save(example);
    }
}
