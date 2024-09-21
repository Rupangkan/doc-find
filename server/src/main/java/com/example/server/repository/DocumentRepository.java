package com.example.server.repository;


import com.example.server.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, String> {
//    Optional<List<Document>> findAllByUserName(String username);
}
