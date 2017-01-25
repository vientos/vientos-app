// FIXME: calculations work only for NW coordinates
export function locationsInBoundingBox (project, boundingBox) {
  return project.locations.filter(location => {
    return location.latitude <= boundingBox.ne.lat &&
           location.latitude >= boundingBox.sw.lat &&
           location.longitude <= boundingBox.ne.lng &&
           location.longitude >= boundingBox.sw.lng
  }).map(location => {
    location.project = project
    return location
  })
}
