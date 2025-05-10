export default function BusLocation() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Localisation actuelle du bus</h2>
      <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        {/* Ici sera intégrée une vraie carte (Google Maps, Leaflet, etc.) */}
        <div className="h-full w-full">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345095696!2d144.95373631531598!3d-37.816279179751824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f2f5e1d1%3A0x1efcf2c273153b14!2sGoogle!5e0!3m2!1sen!2sus!4v1630645032032!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}