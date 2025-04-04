package com.cookBook.repository;

import com.cookBook.entity.ConversionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversionRepository extends JpaRepository<ConversionModel,Long> {

}
