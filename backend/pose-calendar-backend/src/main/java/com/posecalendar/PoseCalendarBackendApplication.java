package com.posecalendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PoseCalendarBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PoseCalendarBackendApplication.class, args);
        System.out.println("Pose calendar backend application started");
    }

}
