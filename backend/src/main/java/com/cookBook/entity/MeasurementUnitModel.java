package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@Table(name = "MEASUREMENT_UNITS")
@AllArgsConstructor
@NoArgsConstructor
public class MeasurementUnitModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;


    @Column(name = "NAME",nullable = false)
    private String name;
}
