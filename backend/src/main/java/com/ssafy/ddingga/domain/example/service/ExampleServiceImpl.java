package com.ssafy.ddingga.domain.example.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.example.entity.Example;
import com.ssafy.ddingga.domain.example.repository.ExampleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ExampleServiceImpl implements ExampleService {
    private final ExampleRepository exampleRepository;

    @Override
    public void createExample(Example example) {
        log.info("예제 - 예제 생성 요청: example={}", example);
        exampleRepository.save(example);
        log.info("예제 - 예제 생성 완료: example={}", example);
    }
}
