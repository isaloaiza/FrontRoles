import { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import { API_URL } from "../Autenticacion/constanst";
import { useAuth } from "../Autenticacion/AutProvider";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [role, setRole] = useState(""); 
  const [, setErrorResponse] = useState("");


  async function handleSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getRefreshToken()}`
        }
      });

     
      
      if (response.ok) {
        auth.signOut();
        window.location.href = "/";
        
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Añadido token de autorización
          }
        });
  
        if (response.ok) {
          const json = await response.json();
          setRole(json.role); // Actualizado el estado del rol
        } else {
          setErrorResponse("Ocurrió un error al obtener el rol del usuario.");
        }
      } catch (error) {
        setErrorResponse("Hubo un problema de red. Inténtalo de nuevo más tarde.");
      }
    }
  
    fetchUserRole(); // Llamar a la función para obtener el rol del usuario al cargar el componente
  }, []);

  return (
    <>
      <header className="principal">
        <div className="container-pri">
          <Link to="/" className="inicio">
            Parking<span className="span">Location.</span>{" "}
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/Perfil">Perfil</Link>
            </li>
            {role === "usuario" && ( 
              <li>
                <Link to="/Dashboard">Mapa navegacion</Link>
              </li>
            )}

            {role === "usuario" && ( 
              <li>
                <Link to="/ExplicacionUsuario">¿Como Funciona?</Link>
              </li>
            )}

            {role === "cliente" && ( 
              <li>
                <Link to="/Explicacion">¿Como Funciona?</Link>
              </li>
            )}
            {role === "cliente" && ( 
              <li>
                <Link to="/Posts">Creacion parqueadero</Link>
              </li>
            )}
            <li>
              <a href="/" onClick={handleSignOut}>
                Salir
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}