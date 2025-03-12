import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ModalActions } from "../components/ModalActions";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit,setIsEdit]=useState(false)
  const [post,setPost]=useState({})

  // Estado modal
  const [show, setShow] = useState(false);
  const handleClose = () => {setShow(false)
     setIsEdit(false)};
  const handleShow = () => setShow(true);

  const getPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("http://localhost:8080/posts");
      setPosts(data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => setIsLoading(false), 500); // Pequeña pausa para asegurar el renderizado
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]); // Se eliminó `isLoading` de las dependencias

  const deletePost = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter(post => post.id !== id));

      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.log("Error en deletePost", error.message);
    }
  };
  const selectPost=(post)=>{
    setIsEdit(true)
    setPost(post)
    handleShow()

  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-5">
        <i className="btn btn-info fas fa-solid fa-plus fa-3x" onClick={handleShow}></i>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center">
          <i className="fas fa-spin fa-solid fa-arrows-rotate fa-5x"></i>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div className="col" key={post.id}>
                <div className="card h-100">
                  <img src={post.imgUrl} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>
                  </div>
                  <div>
                    <div className="card-footer"></div>
                    <div className="d-flex justify-content-between">
                      <i className="btn btn-info fa-solid fa-pen-to-square" onClick={()=> selectPost(post)}></i>
                      <i
                        className="btn btn-danger fa-solid fa-trash"
                        onClick={() => deletePost(post.id)}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3>No hay publicaciones disponibles.</h3>
          )}
        </div>
      )}

      <ModalActions show={show} handleClose={handleClose} getPosts={getPosts} isEdit={isEdit} post={post} />
    </div>
  );
};



