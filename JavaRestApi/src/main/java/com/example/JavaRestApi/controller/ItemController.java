package com.example.JavaRestApi.controller;


import com.example.JavaRestApi.models.Items;
import com.example.JavaRestApi.models.Items;
import com.example.JavaRestApi.repositories.ItemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
public class ItemController {
    private ObjectMapper objectmapper;

    @Autowired
    private ItemRepository itemRep;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getitems")
    public Object getHandler() {
        try{
            return itemRep.findAll();

        }
        catch(Exception e){
            System.out.println("badest");
            return "bad";
        }

    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("tovars/item")
    public Object fetchData(@RequestParam Object itemid){
        System.out.println(itemid.toString());
        return itemRep.findById(itemid.toString());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/deleteitem")
    public void deleteData(@RequestParam Object itemid){
        System.out.println(itemid.toString());
        itemRep.deleteById(itemid.toString());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/updateitem")
    public void updateItem(@RequestParam Object itemid, @RequestBody Map<String, Object> itemData){

        try{
            System.out.println(itemData);
            Items item = itemRep.findById(itemid.toString()).orElse(null);


            item.setCategory(itemData.get("category").toString());
            item.setSubCategory(itemData.get("subCategory").toString());
            item.setName(itemData.get("name").toString());
            item.setDescription(itemData.get("description").toString());
            item.setBrand(itemData.get("brand").toString());
            System.out.println("not bad");
            System.out.println(itemData.get("price").toString());
            item.setPrice(Double.parseDouble(itemData.get("price").toString()));

            item.setImages(itemData.get("images").toString());

            item.setColor(itemData.get("color").toString());

            item.setSizes(itemData.get("sizes").toString());

            if(itemData.get("soleType") != null){
                item.setSoleType(itemData.get("soleType").toString());
            }
            if(itemData.get("weight") != null){
                item.setWeight(Double.parseDouble(itemData.get("weight").toString()));
            }

            //itemRep.save(item);

            System.out.println("Sure");
            System.out.println(item.toString());
            itemRep.save(item);
            System.out.println("Succes saved");

        }catch(Exception e){
            System.out.println("bad");
            System.out.println(e.getMessage());

        }



    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add")
    public String PostHendler(@RequestBody Map<String, Object> itemData){
        try{
            System.out.println(itemData);
            Items item = new Items();
            item.setId(UUID.randomUUID().toString());

            item.setCategory(itemData.get("category").toString());
            item.setSubCategory(itemData.get("subCategory").toString());
            item.setName(itemData.get("name").toString());
            item.setDescription(itemData.get("description").toString());
            item.setBrand(itemData.get("brand").toString());
            System.out.println("not bad");
            System.out.println(itemData.get("price").toString());
            item.setPrice(Double.parseDouble(itemData.get("price").toString()));
            System.out.println("ok");
            item.setImages(itemData.get("images").toString());
            System.out.println("ok1");
            item.setColor(itemData.get("color").toString());
            System.out.println("ok2");
            item.setSizes(itemData.get("sizes").toString());
            System.out.println("ok3");
            if(itemData.get("soleType") != null){
                item.setSoleType(itemData.get("soleType").toString());
            }
            if(itemData.get("weight") != null){
                item.setWeight(Double.parseDouble(itemData.get("weight").toString()));
            }
            System.out.println("ok4");
            //itemRep.save(item);

            System.out.println("Sure");
            System.out.println(item.toString());
            itemRep.save(item);
            System.out.println("Succes saved");
            return "Succesfull!";
        }catch(Exception e){
            System.out.println("bad");
            System.out.println(e.getMessage());
            return "иди нахер";
        }
        //System.out.println("zdor");
        //item.id = UUID.randomUUID();
        //itemRep.save(item);



    }




}
