package com.gasmanager.users.repositories;

import com.gasmanager.users.entities.ia.AsistenteIA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsistenteIARepository extends JpaRepository<AsistenteIA, Integer> {


}
