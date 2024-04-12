package com.example.JavaRestApi.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "orders")
public class Order {
    @Id
    private String id = UUID.randomUUID().toString();

    @JsonProperty("items")
    private String items;

    @JsonProperty("shipping")
    private String shipping;

    @JsonProperty("price")
    private double price;

    @JsonProperty("status")
    private String status;



    private String name;
    public void setPrice(double price){
        this.price = price;
    }
    public double getprice(){
        return price;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setItems(String items) {
        this.items = items;
    }

    public void setShipping(String shipping) {
        this.shipping = shipping;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public String getItems() {
        return items;
    }



    public String getShipping() {
        return shipping;
    }

    public String getStatus() {
        return status;
    }
}
