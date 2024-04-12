package com.example.JavaRestApi.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Version;
import java.util.Date;
import java.util.UUID;


@Document(collection = "items")
public class Items {

    @Id
    private String id = UUID.randomUUID().toString();
    @JsonProperty("category")
    private String category;

    @JsonProperty("subCategory")
    private String subCategory;

    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("brand")
    private String brand;

    @JsonProperty("price")
    private double price;

    @JsonProperty("images")
    private String images;

    @JsonProperty("gender")
    private String gender;

    @JsonProperty("color")
    private String color;

    @JsonProperty("sizes")
    private String sizes;

    @JsonProperty("soleType")
    private String soleType;

    @JsonProperty("material")
    private String material;

    @JsonProperty("weight")
    private double weight;


    // Конструкторы, геттеры и сеттеры



    // Геттеры и сеттеры для всех полей

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }

    // Другие геттеры и сеттеры...



    public void setName(String name) {
        if(name != null){
            this.name = name;
        }

    }

    public void setDescription(String description) {
        if (description != null) {
            this.description = description;
        }

    }

    public void setBrand(String brand) {
        if (brand != null) {
            this.brand = brand;
        }

    }

    public void setPrice(double price) {

            this.price = price;


    }

    public void setImages(String images) {
        if (images != null) {
            this.images = images;
        }

    }

    public void setGender(String gender) {
        if (gender != null) {
            this.gender = gender;
        }

    }

    public void setColor(String color) {
        if (color != null) {
            this.color = color;
        }

    }

    public void setSizes(String sizes) {
        if (sizes != null) {
            this.sizes = sizes;
        }

    }

    public void setSoleType(String soleType) {
        if (soleType != null) {
            this.soleType = soleType;
        }


    }

    public void setMaterial(String material) {
        if (material != null) {
            this.material = material;
        }

    }

    public void setWeight(double weight) {

            this.weight = weight;


    }





    @Override
    public String toString() {
        return "Item{" +
                "id='" + id + '\'' +
                ", category='" + category + '\'' +
                ", subCategory='" + subCategory + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", brand='" + brand + '\'' +
                ", price=" + price +
                ", images='" + images + '\'' +
                ", gender='" + gender + '\'' +
                ", color='" + color + '\'' +
                ", sizes='" + sizes + '\'' +
                ", soleType='" + soleType + '\'' +
                ", material='" + material + '\'' +
                ", weight=" + weight +

                '}';
    }
}