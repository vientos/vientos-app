// FIXME: calculations work only for NW coordinates
export function locationsInBoundingBox (project, boundingBox) {
  // TODO: move normalization to reducer
  if (!project.locations) project.locations = []
  return project.locations.filter(location => {
    return Number(location.latitude) <= boundingBox.ne.lat &&
           Number(location.latitude) >= boundingBox.sw.lat &&
           Number(location.longitude) <= boundingBox.ne.lng &&
           Number(location.longitude) >= boundingBox.sw.lng
  }).map(location => {
    location.project = project
    return location
  })
}
