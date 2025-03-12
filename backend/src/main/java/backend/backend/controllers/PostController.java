package backend.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.backend.models.Post;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins ="*")
public class PostController {

    public List<Post> posts= new ArrayList<>();

    public PostController(){
        Post post1=new Post(UUID.randomUUID(), "Perro perdido en el parque", "perro labrador se perdio por la ubicacion: calle amalcacatl barrio mineros", "https://elcobijo.net/wp-content/uploads/2016/01/mu%C3%B1eco9.jpg");

        

        Post post2=new Post(UUID.randomUUID(), "Perro quiere un amigo", "ayuda a encontrar una buena persona que pueda cuidar a este perrito", "https://sfo2.digitaloceanspaces.com/estaticos/var/www/html/wp-content/uploads/2020/01/web-adopcion-mascotas1-1068x663.jpg");

        Post post3=new Post(UUID.randomUUID(), "registro de visita medica", "cuando fue la ultima vez que vacuno a su perro y que problemas tiene ", "https://tse4.mm.bing.net/th?id=OIP.3sYwbwHSuom12d6UAGpvMAHaE8&pid=Api&P=0&h=180");


        posts.add(post1);
        posts.add(post2);
        posts.add(post3);
    }


    @GetMapping
    public ResponseEntity<?> getPosts(){
        Map<String,Object> response= new HashMap<>();
        response.put("ok","true");
        response.put("data",posts);
        response.put("massage", "Lista de posts");
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable("id") String idStr) {
        Map<String, Object> response = new HashMap<>();
    
        try {
            UUID id = UUID.fromString(idStr); // Convierte el String a UUID
            Post postEncontrado = posts.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst()
                .orElse(null);
    
            if (postEncontrado == null) {
                response.put("ok", "false");
                response.put("data", "");
                response.put("message", "post no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
    
            response.put("ok", "true");
            response.put("data", postEncontrado);
            response.put("message", "post encontrado");
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (IllegalArgumentException e) { // Maneja UUID inválidos
            response.put("ok", "false");
            response.put("data", "");
            response.put("message", "id no válido");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    
    
    
    @PostMapping
    public ResponseEntity<?> savePost(@RequestBody Post post){
        Map<String, Object> response = new HashMap<>();
        post.setId(UUID.randomUUID());
        posts.add(post);
        response.put("ok", "true");
            response.put("data", post);
            response.put("message", "post creado");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
   
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@RequestBody Post post, @PathVariable("id") UUID id) {
        Map<String, Object> response = new HashMap<>();
    
        // Usar UUID directamente
        Post postEncontrado = posts.stream()
            .filter(item -> item.getId().equals(id)) // Asumiendo que item.getId() es un UUID
            .findFirst()
            .orElse(null);
    
        if (postEncontrado == null) {
            response.put("ok", "false");
            response.put("data", "post");
            response.put("message", "post no encontrado");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    
        if (post.getTitle()!=null && !post.getTitle().isEmpty()) {
            postEncontrado.setTitle(post.getTitle());
            
        }
        if (post.getDescription()!=null && !post.getDescription().isEmpty()){
            postEncontrado.setDescription(post.getDescription());

        }
        if (post.getImgUrl()!=null && !post.getImgUrl().isEmpty()){
            postEncontrado.setImgUrl(post.getImgUrl());

        }
    
        response.put("ok", "true");
        response.put("data", postEncontrado);
        response.put("message", "post actualizado");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    

    @DeleteMapping("/{id}")
public ResponseEntity<?> deletePost(@PathVariable("id") UUID id) {
    Map<String, Object> response = new HashMap<>();

    try {
        // No es necesario hacer la conversión de id a UUID
        Post postEncontrado = posts.stream()
            .filter(item -> item.getId().equals(id))  // Directamente usar id como UUID
            .findFirst()
            .orElse(null);

        if (postEncontrado == null) {
            response.put("ok", "false");
            response.put("data", "");
            response.put("message", "post no encontrado");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        posts.remove(postEncontrado);  // Eliminar el post
        response.put("ok", "true");
        response.put("data", "");
        response.put("message", "post eliminado");
        return new ResponseEntity<>(response, HttpStatus.OK);

    } catch (IllegalArgumentException e) {
        response.put("ok", "false");
        response.put("data", "");
        response.put("message", "id no válido");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}

}

    

