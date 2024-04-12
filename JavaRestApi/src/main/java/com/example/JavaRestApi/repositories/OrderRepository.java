package com.example.JavaRestApi.repositories;

import com.example.JavaRestApi.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByName(String name);

}
