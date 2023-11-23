class RecommendFriendHome {
	constructor() {
		this.isAdd = false;
	}

	async render() {
		const that = this;
		const btnAddFriend = $("#btnRecommendFriendHome");

		if (btnAddFriend) {
			const handleAddFriendRequest = (id) => {
				const url = "/SGU_SOCIAL_NETWORK/api/friend_request/add_friend_request";
				const send_data = {
					requestID: id,
					userID: getCookieGlobal("id")
				};

				return new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					xhr.open("POST", url, true);

					xhr.setRequestHeader("Content-Type", "application/json");

					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4) {
							if (xhr.status === 200) {
								try {
									const data = JSON.parse(xhr.responseText);
									console.log(data)
									this.isSendRequest = true;

									resolve(data);
								} catch (error) {
									console.log("JSON parsing error:", error);
									reject(error);
								}
							} else {
								console.log("Request failed with status:", xhr.status);
								reject(new Error(`Error: ${xhr.statusText}`));
							}
						}
					}.bind(this);

					xhr.send(JSON.stringify(send_data));
				});
			}

			btnAddFriend.onclick = async () => {
				if (!that.isAdd) {
					that.isAdd = true;
					await handleAddFriendRequest(btnAddFriend.getAttribute("data-id"));
					btnAddFriend.textContent = "Đã gửi yêu cầu";
					btnAddFriend.classList.add('btn_recommend_friend_home-disable')
				}
			}
		}
	}
}