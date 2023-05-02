let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
	if(pagina < 1000){
		pagina += 1;
		cargarPeliculas();
	}
});

btnAnterior.addEventListener('click', () => {
	if(pagina > 1){
		pagina -= 1;
		cargarPeliculas();
	}
});

const cargarPeliculas = async() => {
	try {
		const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`);
	
		

		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.json();
			
			let peliculas = '';
			datos.results.forEach(pelicula => {
				peliculas += `
					<div class="pelicula">
						<img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
						<h3 class="titulo">${pelicula.title}</h3>
					</div>
				`;
			});

			document.getElementById('contenedor').innerHTML = peliculas;

		} else if(respuesta.status === 401){
			console.log('Pusiste la llave mal');
		} else if(respuesta.status === 404){
			console.log('La pelicula que buscas no existe');
		} else {
			console.log('Hubo un error y no sabemos que paso');
		}

	} catch(error){
		console.log(error);
	}

}

cargarPeliculas();

// funcion para llamar a la API
const llamadaApi = async(urlAPI) => {
	try {
		const data = await fetch(urlAPI);
		const result = await data.json();
		return result;
	} catch (error) {
		console.log(error);
	}
}

const searchaPelicula = async () =>{
	// trael el ID del input que tenemos en html
	let buscador = document.querySelector("#buscador")
	//agregamos evento de escucha para cada vez que oprimamos una tecla
	buscador.addEventListener("input", async(e) => {
		//guradamos el texto escrito en el input en esta variable
		let valorInput = e.target.value
		//traer las peliculas filtradas con la url dada por la API
		let dataFilter = await llamadaApi(`https://api.themoviedb.org/3/search/movie?api_key=3df70b20cbd027249f00bb9372cbadf9&query=${valorInput}`)
		//llamamos al contenedor donde vamos a poner nuestras peliculas filtradas
		let contenedor = document.querySelector("#contenedor");
		//lo colocamos nul para que me borra las pleiulas y me las remplace por las filtradas
		contenedor.innerHTML = null;
		//condicion para que cuando no haya escrito nada en el input me muestra las peliculas principales
		if(valorInput == ""){
			cargarPeliculas();
		}else{
			//recorrer el array de las peliculas filtradas y pintarlas en el contenedor
			dataFilter.results.forEach((val,id) => {
				contenedor.insertAdjacentHTML("beforeend", `
				<div class="pelicula">
							<img class="poster" src="https://image.tmdb.org/t/p/w500/${val.poster_path}">
							<h3 class="titulo">${val.title}</h3>
				</div>`)
			})
			
		}
		
	})
}
searchaPelicula()