class Invendor {

    isProbable(probability = 0) {
        return probability > Date.now() % 100;
    }

}


module.exports = new Invendor()