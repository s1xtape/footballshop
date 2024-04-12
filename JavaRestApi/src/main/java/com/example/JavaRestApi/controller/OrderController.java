package com.example.JavaRestApi.controller;


import com.example.JavaRestApi.models.Order;
import com.example.JavaRestApi.repositories.OrderRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class OrderController {

    @Autowired
    private OrderRepository orderRep;

    ObjectMapper objectMap = new ObjectMapper();
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getallorders")
    public Object GetAllOrders(){
        System.out.println("Orders: " + orderRep.findAll().toString());
        return orderRep.findAll();

    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/updateorder")
    public Object UpdateOrder(@RequestParam Object orderid, @RequestBody Map<String, Object> data){
        System.out.println(data);
        System.out.println(orderid);
        Order order = orderRep.findById(orderid.toString()).orElse(null);

        order.setStatus(data.get("status").toString());

        orderRep.save(order);

        return "Sucessfull updated!";
    }



    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/addorder")
    private String PostHandler(@RequestBody Map<String, Object> data){
        try{



            Order order = new Order();
            System.out.println("data1: " + data);

            order.setId(UUID.randomUUID().toString());


            HashMap<String, Object> itemsmap = new HashMap<>();

            HashMap<String, Object> itemvalMap = new HashMap<>();

            ArrayList itemtest = (ArrayList)data.get("items");

            Map<String, Object> ItemsMap = (Map<String, Object>)itemtest.get(0);
            Map<String, Object> itemMap = (Map<String, Object>)ItemsMap.get("item");

            for(var entry : itemMap.entrySet()){
                itemvalMap.put(entry.getKey(), entry.getValue());
            }
            String jsonitem = objectMap.writeValueAsString(itemvalMap);
            for(var entry: ItemsMap.entrySet()){
                if(entry.getKey() == "item"){
                    System.out.println("that`s item!");
                    System.out.println("item value: " + itemvalMap.toString());
                    itemsmap.put(entry.getKey(), itemvalMap);
                }
                else{
                    System.out.println("that isn`t item? thet`s: "+ entry.getKey());
                    itemsmap.put(entry.getKey(), entry.getValue());
                }
            }
            System.out.println("true stroke: " + itemsmap.toString());





            String jsonitems = objectMap.writeValueAsString(itemsmap);
            order.setItems(jsonitems);

            
            HashMap<String, Object> shippingmap = new HashMap<>();
            Map<String, Object> shippingitems = (Map<String, Object>) data.get("shipping");
            for(var entry : shippingitems.entrySet()){
                shippingmap.put(entry.getKey(), entry.getValue());
            }
            String jsonshipping = objectMap.writeValueAsString(shippingmap);
            System.out.println(jsonshipping);
            order.setShipping(jsonshipping);
            order.setPrice(Double.parseDouble(data.get("price").toString()));
            order.setStatus("Нове замовлення");
            orderRep.save(order);


            System.out.println("order saved succesfull!");
            return "Maybe";
        }
        catch(Exception e){
            System.out.println("bad save order");
            System.out.println(e.getMessage());
            return "Bad";
        }

    }

}
