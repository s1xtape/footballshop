package com.example.JavaRestApi.repositories;

import com.example.JavaRestApi.models.Items;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItemRepository extends MongoRepository<Items, String> {

    List<Items> findByName(String name);


}
