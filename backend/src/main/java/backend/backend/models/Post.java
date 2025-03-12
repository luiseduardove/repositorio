package backend.backend.models;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//**generar constructor */
@AllArgsConstructor
//**dejar el constructor opcional */
@NoArgsConstructor
//**generar setters y getters */
@Data
public class Post {
    private UUID id;
    private String title;
    private String description;
    private String imgUrl;

  
}
