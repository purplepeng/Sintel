## Models
##### Order

| Params | Type | Description |
| --- | --- | ---|
| `id` | `number` |  |
| `petId` | `number` |  |
| `quantity` | `number` |  |
| `shipDate` | `string` |  |
| `status` | `string` | Order Status |
| `complete` | `boolean` |  |

##### Category

| Params | Type | Description |
| --- | --- | ---|
| `id` | `number` |  |
| `name` | `string` |  |

##### User

| Params | Type | Description |
| --- | --- | ---|
| `id` | `number` |  |
| `username` | `string` |  |
| `firstName` | `string` |  |
| `lastName` | `string` |  |
| `email` | `string` |  |
| `password` | `string` |  |
| `phone` | `string` |  |
| `userStatus` | `number` | User Status |

##### Tag

| Params | Type | Description |
| --- | --- | ---|
| `id` | `number` |  |
| `name` | `string` |  |

##### Pet

| Params | Type | Description |
| --- | --- | ---|
| `id` | `number` |  |
| `category` | `Category` |  |
| `name` | `string` |  |
| `photoUrls` | `string[]` |  |
| `tags` | `Tag[]` |  |
| `status` | `string` | pet status in the store |

##### ApiResponse

| Params | Type | Description |
| --- | --- | ---|
| `code` | `number` |  |
| `type` | `string` |  |
| `message` | `string` |  |

##### Goods

| Params | Type | Description |
| --- | --- | ---|
| `name` | `string` |  |
| `price` | `number` |  |
| `desc` | `string` |  |


## API

`POST /pet` 

Add a new pet to the store

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `` | `true` | Pet object that needs to be added to the store |

返回参数：

| Params | Type |
| --- | ---|
          405
___

`PUT /pet` 

Update an existing pet

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `` | `true` | Pet object that needs to be added to the store |

返回参数：

| Params | Type |
| --- | ---|
          400
          404
          405
___



`GET /pet/findByStatus` 

Finds Pets by status

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `array` | `true` | Status values that need to be considered for filter |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
___



`GET /pet/findByTags` 

Finds Pets by tags

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `tags` | `array` | `true` | Tags to filter by |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
___



`GET /pet/{petId}` 

Find pet by ID

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `petId` | `integer` | `true` | ID of pet to return |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
          404
___

`POST /pet/{petId}` 

Updates a pet in the store with form data

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `petId` | `integer` | `true` | ID of pet that needs to be updated |
| `name` | `string` | `false` | Updated name of the pet |
| `status` | `string` | `false` | Updated status of the pet |

返回参数：

| Params | Type |
| --- | ---|
          405
___

`DELETE /pet/{petId}` 

Deletes a pet

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `api_key` | `string` | `false` |  |
| `petId` | `integer` | `true` | Pet id to delete |

返回参数：

| Params | Type |
| --- | ---|
          400
          404
___



`POST /pet/{petId}/uploadImage` 

uploads an image

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `petId` | `integer` | `true` | ID of pet to update |
| `additionalMetadata` | `string` | `false` | Additional data to pass to server |
| `file` | `file` | `false` | file to upload |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
___



`GET /store/inventory` 

Returns pet inventories by status

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
___



`POST /store/order` 

Place an order for a pet

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `` | `true` | order placed for purchasing the pet |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
___



`GET /store/order/{orderId}` 

Find purchase order by ID

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `orderId` | `integer` | `true` | ID of pet that needs to be fetched |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
          404
___

`DELETE /store/order/{orderId}` 

Delete purchase order by ID

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `orderId` | `integer` | `true` | ID of the order that needs to be deleted |

返回参数：

| Params | Type |
| --- | ---|
          400
          404
___



`POST /user` 

Create user

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `` | `true` | Created user object |

返回参数：

| Params | Type |
| --- | ---|
          default
___



`POST /user/createWithArray` 

Creates list of users with given input array

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `` | `true` | List of user object |

返回参数：

| Params | Type |
| --- | ---|
          default
___



`POST /user/createWithList` 

Creates list of users with given input array

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `` | `true` | List of user object |

返回参数：

| Params | Type |
| --- | ---|
          default
___



`GET /user/login` 

Logs user into the system

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | `true` | The user name for login |
| `password` | `string` | `true` | The password for login in clear text |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
___



`GET /user/logout` 

Logs out current logged in user session

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |

返回参数：

| Params | Type |
| --- | ---|
          default
___



`GET /user/{username}` 

Get user by user name

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | `true` | The name that needs to be fetched. Use user1 for testing.  |

返回参数：

| Params | Type |
| --- | ---|
          200[object Object]
          400
          404
___

`PUT /user/{username}` 

Updated user

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | `true` | name that need to be updated |
| `body` | `` | `true` | Updated user object |

返回参数：

| Params | Type |
| --- | ---|
          400
          404
___

`DELETE /user/{username}` 

Delete user

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | `true` | The name that needs to be deleted |

返回参数：

| Params | Type |
| --- | ---|
          400
          404
___


