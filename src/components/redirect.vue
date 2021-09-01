<template>
    <div id="congrats">
        Congratulations. Registration was successful! <br>
        You will be redirect to the homepage in {{countdown}} seconds or click <a href="/">here.</a>
    </div>
</template>

<script>
import '../assets/style/components/redirect.css'

export default {
    data() {
        return {
            countdown: 10
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