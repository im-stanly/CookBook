package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Table(name = "MEASUREMENT_UNITS")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MeasurementUnitModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @Column(name = "NAME",nullable = false)
    private String name;

    @OneToMany(mappedBy = "from")
    private List<ConversionModel> availableConversions;
}
