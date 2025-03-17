package com.ssafy.ddingga.domain.example.repository;

import com.ssafy.ddingga.domain.example.entity.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExampleRepository extends JpaRepository<Example, Integer> {

}
