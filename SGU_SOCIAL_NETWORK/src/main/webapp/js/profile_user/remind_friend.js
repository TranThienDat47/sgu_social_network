class RemindFriend {

	constructor() {
		this.LENGTHPAGE = 8;
		this.currendPage = 0;
		this.listFriend = [];
	}

	async fetchListFriendRemind() {

		function getCookieGlobal(name) {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].trim();
				if (cookie.indexOf(name + '=') === 0) {
					var encodedValue = cookie.substring(name.length + 1, cookie.length);
					var decodedValue = decodeURIComponent(encodedValue);
					return decodedValue;
				}
			}
			return null;
		}



		const that = this;

		const url = "/SGU_SOCIAL_NETWORK/api/friend/search_friend";
		const send_data = {
			limitValue: that.LENGTHPAGE,
			offsetValue: that.LENGTHPAGE * that.currendPage,
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
							that.listFriend = data;

							that.currendPage += 1;

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

	async renderListFriend() {
		const that = this;

		if (that.listFriend) {

			const renderListfriends = await Promise.all(that.listFriend.map(async (element) => {
				const friendData = {
					image: element.image,
					name: element.firstName + " " + element.lastName,
					id: element.id,
					countRoomate: element.coutRoomate,
					friendID: parseInt(element.friendID) === parseInt(getCookieGlobal("id")) ? element.userID : element.friendID,
				};

				const userFriendItem = new UserFriendItem(friendData);
				const result = userFriendItem.render();

				return result;
			}));

			return renderListfriends.join("");
		} else {
			return "";
		}

	}

	async render() {
		const $ = document.querySelector.bind(document);

		const that = this;
		const wrapperRemindFriend = $("#list_friend-list_member")
		await that.fetchListFriendRemind();
		await that.renderListFriend().then((resultRender) => {
			const wrapperRenderListFriend = $('#list_friend-list_member');
			if (wrapperRenderListFriend) {
				wrapperRenderListFriend.innerHTML = resultRender;
			}
		});

	}
}

new RemindFriend().render();