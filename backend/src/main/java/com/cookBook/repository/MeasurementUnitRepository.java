package com.cookBook.repository;

import com.cookBook.entity.MeasurementUnitModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeasurementUnitRepository extends JpaRepository<MeasurementUnitModel,Long> {

}
