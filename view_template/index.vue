<template>
<div class="view-name">
    Hello
    --{{msg}}--
    <test class="test"></test>
</div>
</template>
<style lang="less" scoped>
.<view-name>{
     
}
</style>
<script>
// import xxxx from 'xxxxx';

export default{
    data () {
        return {
            msg: '<view-name>'
        };
    },
    components: {
        // xxxx
    }
};
</script>
