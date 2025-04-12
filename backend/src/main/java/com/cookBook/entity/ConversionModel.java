package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Builder
@Table(name = "MU_CONVERSIONS")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConversionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @ManyToOne
    @JoinColumn(name = "MU_FROM_ID",nullable = false)
    private MeasurementUnitModel from;

    @ManyToOne
    @JoinColumn(name = "MU_TO_ID",nullable = false)
    private MeasurementUnitModel to;

    @Column(name = "CONVERSION_PER_ONE_UNIT",nullable = false)
    private float conversionPerOneUnit;
}
