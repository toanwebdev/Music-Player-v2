const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const songList = $('.music-list-songs')
const songDetailName = $('.song-detail__name')
const songDetailSinger = $('.song-detail__singer')
const songImg = $('.song-img img')
const audio = $('.main-audio')

const repeatBtn = $('.control__repeat-btn')
const prevBtn = $('.control__prev-btn')
const playBtn = $('.control__play-pause')
const nextBtn = $('.control__next-btn')
const randomBtn = $('.control__random-btn')

const progress = $('.progress')
const progressBar = $('.progress-bar')
const currentTime = $('.song-timer__current')
const durationTime = $('.song-timer__max-duration')

const songListBtn = $('.top-bar__playlist-btn')
const heartBtn = $('.top-bar__heart-btn')
const musicList = $('.music-list')
const musicListClose = $('.music-list__header-close-btn')
const musicListSongs = $('.music-list-songs')

const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,

	randomIndexs: [],

	songs: [
		{
			name: 'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
			singer: 'Erik',
			path: './assets/music/song1.mp3',
			image: './assets/image/song1.jpg',
			time: '3:43',
		},
		{
			name: 'Người Em Cố Đô',
			singer: 'Rum x ĐAA',
			path: './assets/music/song2.mp3',
			image: './assets/image/song2.jpg',
			time: '3:33',
		},
		{
			name: 'Đường Tôi Chở Em Về',
			singer: 'Bùi Trường Linh',
			path: './assets/music/song3.mp3',
			image: './assets/image/song3.jpg',
			time: '4:26',
		},
		{
			name: 'Trên Tình Bạn Dưới Tình Yêu',
			singer: 'MIN',
			path: './assets/music/song4.mp3',
			image: './assets/image/song4.jpg',
			time: '3:19',
		},
		{
			name: 'Phải Chăng Em Đã Yêu?',
			singer: 'RedT',
			path: './assets/music/song5.mp3',
			image: './assets/image/song5.jpg',
			time: '3:10',
		},
		{
			name: 'Sài Gòn Đau Lòng Quá',
			singer: 'Hứa Kim Tuyền',
			path: './assets/music/song6.mp3',
			image: './assets/image/song6.jpg',
			time: '5:08',
		},
		{
			name: 'Chờ Ngày Mưa Tan',
			singer: 'Noo Phước Thịnh',
			path: './assets/music/song7.mp3',
			image: './assets/image/song7.jpg',
			time: '3:32',
		},
		{
			name: 'Hẹn Một Mai',
			singer: 'Bùi Anh Tuấn',
			path: './assets/music/song8.mp3',
			image: './assets/image/song8.jpg',
			time: '4:43',
		},
		{
			name: 'Sợ Rằng Em Biết Anh Còn Yêu Em',
			singer: 'Juu Đăng Dũng',
			path: './assets/music/song9.mp3',
			image: './assets/image/song9.jpg',
			time: '5:22',
		},
		{
			name: 'Hoa Nở Không Màu',
			singer: 'Hoài Lâm',
			path: './assets/music/song10.mp3',
			image: './assets/image/song10.jpg',
			time: '5:28',
		},
	],

	render: function () {
		const htmls = this.songs.map((song, index) => {
			return `<li data-index=${index} class="music-list__item ${
				index === this.currentIndex ? 'playing' : ''
			}">
                <div class="music-list-row">
                  <span class="music-list__item-name">${song.name}</span>
                  <p class="music-list__item-singer">${song.singer}</p>
                </div>
                <span class="audio-duration">${
									index === this.currentIndex ? 'Playing' : song.time
								}</span>
              </li>`
		})

		songList.innerHTML = htmls.join('')
	},

	handleEvents: function () {
		const _this = this

		// xử lý CD quay / dừng
		const songImgAnimate = songImg.animate([{ transform: 'rotate(360deg)' }], {
			duration: 10000,
			iterations: Infinity,
		})

		songImgAnimate.pause()

		// xử lý khi click play
		playBtn.onclick = function () {
			if (_this.isPlaying) {
				audio.pause()
			} else {
				audio.play()
			}
		}

		// khi song được play
		audio.onplay = function () {
			_this.isPlaying = true
			playBtn.classList.add('playing')
			songImgAnimate.play()
		}

		// khi song bị pause
		audio.onpause = function () {
			_this.isPlaying = false
			playBtn.classList.remove('playing')
			songImgAnimate.pause()
		}

		// khi prev song
		prevBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong()
			} else {
				_this.prevSong()
			}
			audio.play()
		}

		// khi next song
		nextBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong()
			} else {
				_this.nextSong()
			}
			audio.play()
		}

		// bật / tắt random song
		randomBtn.onclick = function (e) {
			_this.isRandom = !_this.isRandom
			randomBtn.classList.toggle('active', _this.isRandom)
		}

		// xử lý lặp lại một song
		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat
			repeatBtn.classList.toggle('active', _this.isRepeat)
		}

		// xử lý next song khi audio ended
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play()
			} else {
				nextBtn.click()
			}
		}

		// khi tiến độ bài hát thay đổi
		audio.ontimeupdate = function () {
			if (audio.duration) {
				const progressPercent = (audio.currentTime / audio.duration) * 100
				progressBar.style.width = `${progressPercent}%`
			}

			// cập nhật current-time
			const currentTimeMin = Math.floor(audio.currentTime / 60)
			let currentTimeSec = Math.floor(audio.currentTime % 60)

			if (currentTimeSec < 10) {
				currentTimeSec = `0${currentTimeSec}`
			}

			currentTime.textContent = `${currentTimeMin}:${currentTimeSec}`
		}

		// cập nhật duration
		audio.onloadeddata = function () {
			const durationMin = Math.floor(audio.duration / 60)
			let durationSec = Math.floor(audio.duration % 60)

			if (durationSec < 10) {
				durationSec = `0${durationSec}`
			}

			durationTime.textContent = `${durationMin}:${durationSec}`
		}

		// xử lý khi tua song
		progress.onclick = function (e) {
			const progressWidth = progress.clientWidth
			const clickedOffsetX = e.offsetX
			audio.currentTime = (clickedOffsetX / progressWidth) * audio.duration
			audio.play()
		}

		// hiển thị yêu thích
		heartBtn.onclick = function () {
			_this.isFavourite = !_this.isFavourite
			heartBtn.classList.toggle('active', _this.isFavourite)
		}

		// hiển thị music list
		songListBtn.onclick = function () {
			musicList.classList.toggle('show')
		}

		// ẩn music list
		musicListClose.onclick = function () {
			musicList.classList.remove('show')
		}

		// lắng nghe hành vi click playlist
		musicListSongs.onclick = function (e) {
			const songNode = e.target.closest('.music-list__item:not(.playing)')

			const songCurrentNode = $('.music-list__item.playing')
			songCurrentNode.classList.remove('playing')
			songCurrentNode.lastElementChild.textContent =
				_this.songs[_this.currentIndex].time

			_this.currentIndex = Number(songNode.dataset.index)
			_this.loadCurrentSong()
			audio.play()

			songNode.classList.add('playing')
			songNode.lastElementChild.textContent = 'Playing'
		}
	},

	loadCurrentSong: function () {
		songDetailName.textContent = this.songs[this.currentIndex].name
		songDetailSinger.textContent = this.songs[this.currentIndex].singer
		songImg.src = this.songs[this.currentIndex].image
		audio.src = this.songs[this.currentIndex].path
	},

	updateSongPlaying: function () {
		const songCurrentNode = $('.music-list__item.playing')
		songCurrentNode.classList.remove('playing')
		songCurrentNode.lastElementChild.textContent =
			this.songs[this.currentIndex].time

		const songNodes = $$('.music-list__item')
		const songNodeArray = [...songNodes]
		songNodeArray.map((song) => {
			if (Number(song.dataset.index) === this.currentIndex) {
				song.classList.add('playing')
				song.lastElementChild.textContent = 'Playing'
				return
			}
		})
	},

	prevSong: function () {
		this.currentIndex--
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1
		}
		this.loadCurrentSong()
		this.updateSongPlaying()
	},

	nextSong: function () {
		this.currentIndex++
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0
		}
		this.loadCurrentSong()
		this.updateSongPlaying()
	},

	randomSong: function () {
		let newIndex
		let checkIndex = true

		if (
			this.randomIndexs.length === this.songs.length ||
			this.randomIndexs.length === 0
		) {
			this.randomIndexs = [this.currentIndex]
		}

		do {
			newIndex = Math.floor(Math.random() * this.songs.length)
			if (!this.randomIndexs.includes(newIndex)) {
				checkIndex = false
				this.randomIndexs.push(newIndex)
				console.log(this.randomIndexs, newIndex)
			}
		} while (newIndex === this.currentIndex || checkIndex)

		this.currentIndex = newIndex
		this.loadCurrentSong()
		this.updateSongPlaying()
	},

	start: function () {
		// Lắng nghe / xử lý các sự kiện (DOM Events)
		this.handleEvents()

		// Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
		this.loadCurrentSong()

		// Render play list
		this.render()
	},
}

app.start()
