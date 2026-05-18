package com.example.vgashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.vgashop.entity.ServicePolicy;

@Repository
public interface ServicePolicyRepository extends JpaRepository<ServicePolicy, String> {
}
