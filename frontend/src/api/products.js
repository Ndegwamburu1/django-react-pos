const PRODUCTS_API = 'http://127.0.0.1:8000/api/products/'

function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return response.json()
}

export function getProducts() {
  return fetch(PRODUCTS_API).then((response) =>
    handleResponse(response, 'Products could not be loaded'),
  )
}

export function createProduct(productForm) {
  return fetch(PRODUCTS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productForm),
  }).then((response) =>
    handleResponse(response, 'Product could not be created'),
  )
}

export function updateProduct(productId, productForm) {
  return fetch(`${PRODUCTS_API}${productId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productForm),
  }).then((response) =>
    handleResponse(response, 'Product could not be updated'),
  )
}

export function deleteProduct(productId) {
  return fetch(`${PRODUCTS_API}${productId}/`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Product could not be deleted')
    }

    return true
  })
}