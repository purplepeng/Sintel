import request from '@/utils/request'


export interface AddPetParams {
  body: undefined; // Pet object that needs to be added to the store
}

// 
export async function addPet(params: AddPetParams) {
  return request('/pet', {
    method: 'POST',
    data: params
  })
}


export interface UpdatePetParams {
  body: undefined; // Pet object that needs to be added to the store
}

// 
export async function updatePet(params: UpdatePetParams) {
  return request('/pet', {
    method: 'PUT',
    data: params
  })
}


export interface FindPetsByStatusParams {
  status: array; // Status values that need to be considered for filter
}

// Multiple status values can be provided with comma separated strings
export async function findPetsByStatus(params: FindPetsByStatusParams) {
  return request('/pet/findByStatus', {
    method: 'GET',
    params
  })
}


export interface FindPetsByTagsParams {
  tags: array; // Tags to filter by
}

// Muliple tags can be provided with comma separated strings. Use         tag1, tag2, tag3 for testing.
export async function findPetsByTags(params: FindPetsByTagsParams) {
  return request('/pet/findByTags', {
    method: 'GET',
    params
  })
}


export interface GetPetByIdParams {
  petId: integer; // ID of pet to return
}

// Returns a single pet
export async function getPetById(params: GetPetByIdParams) {
  return request('/pet/{petId}', {
    method: 'GET',
    params
  })
}


export interface UpdatePetWithFormParams {
  petId: integer; // ID of pet that needs to be updated
  name?: string; // Updated name of the pet
  status?: string; // Updated status of the pet
}

// 
export async function updatePetWithForm(params: UpdatePetWithFormParams) {
  return request('/pet/{petId}', {
    method: 'POST',
    data: params
  })
}


export interface DeletePetParams {
  api_key?: string; 
  petId: integer; // Pet id to delete
}

// 
export async function deletePet(params: DeletePetParams) {
  return request('/pet/{petId}', {
    method: 'DELETE',
    data: params
  })
}


export interface UploadFileParams {
  petId: integer; // ID of pet to update
  additionalMetadata?: string; // Additional data to pass to server
  file?: file; // file to upload
}

// 
export async function uploadFile(params: UploadFileParams) {
  return request('/pet/{petId}/uploadImage', {
    method: 'POST',
    data: params
  })
}

// Returns a map of status codes to quantities
export async function getInventory() {
  return request('/store/inventory', {
    method: 'GET',
  })
}


export interface PlaceOrderParams {
  body: undefined; // order placed for purchasing the pet
}

// 
export async function placeOrder(params: PlaceOrderParams) {
  return request('/store/order', {
    method: 'POST',
    data: params
  })
}


export interface GetOrderByIdParams {
  orderId: integer; // ID of pet that needs to be fetched
}

// For valid response try integer IDs with value >= 1 and <= 10.         Other values will generated exceptions
export async function getOrderById(params: GetOrderByIdParams) {
  return request('/store/order/{orderId}', {
    method: 'GET',
    params
  })
}


export interface DeleteOrderParams {
  orderId: integer; // ID of the order that needs to be deleted
}

// For valid response try integer IDs with positive integer value.         Negative or non-integer values will generate API errors
export async function deleteOrder(params: DeleteOrderParams) {
  return request('/store/order/{orderId}', {
    method: 'DELETE',
    data: params
  })
}


export interface CreateUserParams {
  body: undefined; // Created user object
}

// This can only be done by the logged in user.
export async function createUser(params: CreateUserParams) {
  return request('/user', {
    method: 'POST',
    data: params
  })
}


export interface CreateUsersWithArrayInputParams {
  body: undefined; // List of user object
}

// 
export async function createUsersWithArrayInput(params: CreateUsersWithArrayInputParams) {
  return request('/user/createWithArray', {
    method: 'POST',
    data: params
  })
}


export interface CreateUsersWithListInputParams {
  body: undefined; // List of user object
}

// 
export async function createUsersWithListInput(params: CreateUsersWithListInputParams) {
  return request('/user/createWithList', {
    method: 'POST',
    data: params
  })
}


export interface LoginUserParams {
  username: string; // The user name for login
  password: string; // The password for login in clear text
}

// 
export async function loginUser(params: LoginUserParams) {
  return request('/user/login', {
    method: 'GET',
    params
  })
}

// 
export async function logoutUser() {
  return request('/user/logout', {
    method: 'GET',
  })
}


export interface GetUserByNameParams {
  username: string; // The name that needs to be fetched. Use user1 for testing. 
}

// 
export async function getUserByName(params: GetUserByNameParams) {
  return request('/user/{username}', {
    method: 'GET',
    params
  })
}


export interface UpdateUserParams {
  username: string; // name that need to be updated
  body: undefined; // Updated user object
}

// This can only be done by the logged in user.
export async function updateUser(params: UpdateUserParams) {
  return request('/user/{username}', {
    method: 'PUT',
    data: params
  })
}


export interface DeleteUserParams {
  username: string; // The name that needs to be deleted
}

// This can only be done by the logged in user.
export async function deleteUser(params: DeleteUserParams) {
  return request('/user/{username}', {
    method: 'DELETE',
    data: params
  })
}
