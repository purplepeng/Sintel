import request from '@/utils/request'


export interface AddPetParams {
   body: any; // Pet object that needs to be added to the store
}

// Add a new pet to the store
export async function addPet(params: AddPetParams) {
  return request('/pet', {
    method: 'POST',
    data: params,
  })
}

export interface UpdatePetParams {
   body: any; // Pet object that needs to be added to the store
}

// Update an existing pet
export async function updatePet(params: UpdatePetParams) {
  return request('/pet', {
    method: 'PUT',
    data: params,
  })
}

export interface FindPetsByStatusParams {
   status: string[]; // Status values that need to be considered for filter
}

// Finds Pets by status
export async function findPetsByStatus(params: FindPetsByStatusParams) {
  return request('/pet/findByStatus', {
    method: 'GET',
    params: params,
  })
}

export interface FindPetsByTagsParams {
   tags: string[]; // Tags to filter by
}

// Finds Pets by tags
export async function findPetsByTags(params: FindPetsByTagsParams) {
  return request('/pet/findByTags', {
    method: 'GET',
    params: params,
  })
}

export interface GetPetByIdParams {
   petId: number; // ID of pet to return
}

// Find pet by ID
export async function getPetById(params: GetPetByIdParams) {
  return request('/pet/{petId}', {
    method: 'GET',
    params: params,
  })
}

export interface UpdatePetWithFormParams {
   petId: number; // ID of pet that needs to be updated
   name: string; // Updated name of the pet
   status: string; // Updated status of the pet
}

// Updates a pet in the store with form data
export async function updatePetWithForm(params: UpdatePetWithFormParams) {
  return request('/pet/{petId}', {
    method: 'POST',
    data: params,
  })
}

export interface DeletePetParams {
   api_key: string; 
   petId: number; // Pet id to delete
}

// Deletes a pet
export async function deletePet(params: DeletePetParams) {
  return request('/pet/{petId}', {
    method: 'DELETE',
    data: params,
  })
}

export interface UploadFileParams {
   petId: number; // ID of pet to update
   additionalMetadata: string; // Additional data to pass to server
   file: any; // file to upload
}

// uploads an image
export async function uploadFile(params: UploadFileParams) {
  return request('/pet/{petId}/uploadImage', {
    method: 'POST',
    data: params,
  })
}

// Returns pet inventories by status
export async function getInventory() {
  return request('/store/inventory', {
    method: 'GET',
  })
}

export interface PlaceOrderParams {
   body: any; // order placed for purchasing the pet
}

// Place an order for a pet
export async function placeOrder(params: PlaceOrderParams) {
  return request('/store/order', {
    method: 'POST',
    data: params,
  })
}

export interface GetOrderByIdParams {
   orderId: number; // ID of pet that needs to be fetched
}

// Find purchase order by ID
export async function getOrderById(params: GetOrderByIdParams) {
  return request('/store/order/{orderId}', {
    method: 'GET',
    params: params,
  })
}

export interface DeleteOrderParams {
   orderId: number; // ID of the order that needs to be deleted
}

// Delete purchase order by ID
export async function deleteOrder(params: DeleteOrderParams) {
  return request('/store/order/{orderId}', {
    method: 'DELETE',
    data: params,
  })
}

export interface CreateUserParams {
   body: any; // Created user object
}

// Create user
export async function createUser(params: CreateUserParams) {
  return request('/user', {
    method: 'POST',
    data: params,
  })
}

export interface CreateUsersWithArrayInputParams {
   body: any; // List of user object
}

// Creates list of users with given input array
export async function createUsersWithArrayInput(params: CreateUsersWithArrayInputParams) {
  return request('/user/createWithArray', {
    method: 'POST',
    data: params,
  })
}

export interface CreateUsersWithListInputParams {
   body: any; // List of user object
}

// Creates list of users with given input array
export async function createUsersWithListInput(params: CreateUsersWithListInputParams) {
  return request('/user/createWithList', {
    method: 'POST',
    data: params,
  })
}

export interface LoginUserParams {
   username: string; // The user name for login
   password: string; // The password for login in clear text
}

// Logs user into the system
export async function loginUser(params: LoginUserParams) {
  return request('/user/login', {
    method: 'GET',
    params: params,
  })
}

// Logs out current logged in user session
export async function logoutUser() {
  return request('/user/logout', {
    method: 'GET',
  })
}

export interface GetUserByNameParams {
   username: string; // The name that needs to be fetched. Use user1 for testing. 
}

// Get user by user name
export async function getUserByName(params: GetUserByNameParams) {
  return request('/user/{username}', {
    method: 'GET',
    params: params,
  })
}

export interface UpdateUserParams {
   username: string; // name that need to be updated
   body: any; // Updated user object
}

// Updated user
export async function updateUser(params: UpdateUserParams) {
  return request('/user/{username}', {
    method: 'PUT',
    data: params,
  })
}

export interface DeleteUserParams {
   username: string; // The name that needs to be deleted
}

// Delete user
export async function deleteUser(params: DeleteUserParams) {
  return request('/user/{username}', {
    method: 'DELETE',
    data: params,
  })
}
