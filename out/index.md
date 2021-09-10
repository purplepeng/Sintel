## Models

##### Order

| Params | Type | Description |
| --- | --- | ---|
|`id`|`integer`|-| 
|`petId`|`integer`|-| 
|`quantity`|`integer`|-| 
|`shipDate`|`string`|-| 
|`status`|`string`|Order Status| 
|`complete`|`boolean`|-| 

##### Category

| Params | Type | Description |
| --- | --- | ---|
|`id`|`integer`|-| 
|`name`|`string`|-| 

##### User

| Params | Type | Description |
| --- | --- | ---|
|`id`|`integer`|-| 
|`username`|`string`|-| 
|`firstName`|`string`|-| 
|`lastName`|`string`|-| 
|`email`|`string`|-| 
|`password`|`string`|-| 
|`phone`|`string`|-| 
|`userStatus`|`integer`|User Status| 

##### Tag

| Params | Type | Description |
| --- | --- | ---|
|`id`|`integer`|-| 
|`name`|`string`|-| 

##### Pet

| Params | Type | Description |
| --- | --- | ---|
|`id`|`integer`|-| 
|`category`|`Category`|undefined| 
|`name`|`string`|-| 
|`photoUrls`|`string[]`|-| 
|`tags`|`Tag[]`|-| 
|`status`|`string`|pet status in the store| 

##### ApiResponse

| Params | Type | Description |
| --- | --- | ---|
|`code`|`integer`|-| 
|`type`|`string`|-| 
|`message`|`string`|-| 

##### Goods - goods model

| Params | Type | Description |
| --- | --- | ---|
|`name`|`string`|-| 
|`price`|`number`|-| 
|`desc`|`string`|-| 
## API

`POST``/pet`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`body`|`undefined`|true|Pet object that needs to be added to the store| 

返回参数：

| Params | Type |
| --- | ---|
___

`PUT``/pet`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`body`|`undefined`|true|Pet object that needs to be added to the store| 

返回参数：

| Params | Type |
| --- | ---|
___

`GET``/pet/findByStatus`Multiple status values can be provided with comma separated strings

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`status`|`array`|true|Status values that need to be considered for filter| 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`Pet[]`|
___

`GET``/pet/findByTags`Muliple tags can be provided with comma separated strings. Use         tag1, tag2, tag3 for testing.

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`tags`|`array`|true|Tags to filter by| 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`Pet[]`|
___

`GET``/pet/{petId}`Returns a single pet

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`petId`|`integer`|true|ID of pet to return| 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`Pet`|
___

`POST``/pet/{petId}`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`petId`|`integer`|true|ID of pet that needs to be updated| 
|`name`|`string`|-|Updated name of the pet| 
|`status`|`string`|-|Updated status of the pet| 

返回参数：

| Params | Type |
| --- | ---|
___

`DELETE``/pet/{petId}`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`api_key`|`string`|-|-| 
|`petId`|`integer`|true|Pet id to delete| 

返回参数：

| Params | Type |
| --- | ---|
___

`POST``/pet/{petId}/uploadImage`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`petId`|`integer`|true|ID of pet to update| 
|`additionalMetadata`|`string`|-|Additional data to pass to server| 
|`file`|`file`|-|file to upload| 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`ApiResponse`|
___

`GET``/store/inventory`Returns a map of status codes to quantities

请求参数：
无

返回参数：

| Params | Type |
| --- | ---|
___

`POST``/store/order`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`body`|`undefined`|true|order placed for purchasing the pet| 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`Order`|
___

`GET``/store/order/{orderId}`For valid response try integer IDs with value >= 1 and <= 10.         Other values will generated exceptions

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`orderId`|`integer`|true|ID of pet that needs to be fetched| 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`Order`|
___

`DELETE``/store/order/{orderId}`For valid response try integer IDs with positive integer value.         Negative or non-integer values will generate API errors

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`orderId`|`integer`|true|ID of the order that needs to be deleted| 

返回参数：

| Params | Type |
| --- | ---|
___

`POST``/user`This can only be done by the logged in user.

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`body`|`undefined`|true|Created user object| 

返回参数：

| Params | Type |
| --- | ---|
___

`POST``/user/createWithArray`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`body`|`undefined`|true|List of user object| 

返回参数：

| Params | Type |
| --- | ---|
___

`POST``/user/createWithList`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`body`|`undefined`|true|List of user object| 

返回参数：

| Params | Type |
| --- | ---|
___

`GET``/user/login`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`username`|`string`|true|The user name for login| 
|`password`|`string`|true|The password for login in clear text| 

返回参数：

| Params | Type |
| --- | ---|
___

`GET``/user/logout`

请求参数：
无

返回参数：

| Params | Type |
| --- | ---|
___

`GET``/user/{username}`

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`username`|`string`|true|The name that needs to be fetched. Use user1 for testing. | 

返回参数：

| Params | Type |
| --- | ---|
|`result`|`User`|
___

`PUT``/user/{username}`This can only be done by the logged in user.

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`username`|`string`|true|name that need to be updated| 
|`body`|`undefined`|true|Updated user object| 

返回参数：

| Params | Type |
| --- | ---|
___

`DELETE``/user/{username}`This can only be done by the logged in user.

请求参数：

| Params | Type | Required | Description |
| --- | --- | --- | --- |
|`username`|`string`|true|The name that needs to be deleted| 

返回参数：

| Params | Type |
| --- | ---|
___
