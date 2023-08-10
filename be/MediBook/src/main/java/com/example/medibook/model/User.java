package com.example.medibook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user")
@Data
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "email", unique = true)
    @Email(message = "The email address is invalid!")
    private String email;

    @Column(name = "password")
    @NotBlank(message = "Password is empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Getter
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "first_name")
    @NotBlank(message = "First name is empty")
    @Size(max = 50, message = "First name should have maximum length of 50 characters")
    private String firstName;

    @Column(name = "last_name")
    @NotBlank(message = "Last name is empty")
    @Size(max = 50, message = "Last name should have maximum length of 50 characters")
    private String lastName;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
