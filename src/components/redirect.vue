<template>
    <div>
        Congratulations. Registration done! <br>
        You will be redirect to the homepage in {{countdown}} seconds or click <a href="/">here.</a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            countdown: 5
        }
    },
    created() {
        this.countDownTimer()
    },
    methods: {
        countDownTimer() {
            if(this.countdown > 0) {
                setTimeout(() => {
                    this.countdown -= 1
                    this.countDownTimer()
                }, 1000)
            } else {
                this.$router.push({ path: '/'});
            }
        }
    }
}
</script>