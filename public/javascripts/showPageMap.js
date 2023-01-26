//const goodCampground = JSON.parse( campground );

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map( {
        container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates,
    //center: goodCampground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    } );

map.addControl( new mapboxgl.NavigationControl() );

new mapboxgl.Marker()
    .setLngLat( campground.geometry.coordinates )
    //.setLngLat( goodCampground.geometry.coordinates )
    .setPopup(
        new mapboxgl.Popup( { offset: 25 } )
            .setHTML(
                `<h3>${ campground.title }</h3><p>${ campground.location }</p>`
                //`<h3>${goodCampground.title}</h3><p>${goodCampground.location}</p>`
            )
    )
    .addTo( map )