package com.cookBook.repository;

import com.cookBook.entity.DishModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishRepository extends JpaRepository<DishModel,Long> {

}
