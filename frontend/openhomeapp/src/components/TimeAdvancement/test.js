class IncreaseTIme extends Component {
    constructor() {
        super();
        this.state = {
            curTime: '',
            timediff: '',
            setTime: '',
            startDate: new Date(),
            time: '10:00',
        };

        this.onTimeChange = this.onTimeChange.bind(this);
    }

    // componentDidMount() {
    //     setInterval(() => {
    //         this.setState({
    //             curTime: new Date().toLocaleString()
    //         })
    //     }, 1000)
    // }


    getSystemTime = () => {

        axios.get(`${ROOT_URL}/systemdate`)
            .then((response) => {
                console.log("response", response)
                if (response.data) {
                    console.log(response.data);
                    console.log(moment(response.data));
                    console.log("CURRENT JAVASCRIPT TIME", moment());
                }
            })
            .catch(error => {
                console.log("=====errror", error)
            })
            ;
    }

    onChange1 = () => {

    }

    setSystemTime = () => {

        var d = new Date().getTime() + 60000;
        // var d = new Date();
        // var d = moment(currentDate, 'YYYY-MM-DD h:mm A') ;
        // d.add(1, 'days');
        var data = {
            "date": d
        }

        axios.post(`${ROOT_URL}/systemdate`, data)
            .then((response) => {
                console.log("response", response)
                if (response.data) {
                    console.log("dddddddddddd", d);
                    console.log(response.data);
                    console.log(moment(response.data));
                    console.log("CURRENT JAVASCRIPT TIME", moment());
                }
            })
            .catch(error => {
                console.log("=====errror", error)
            })



    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    onChange = time => this.setState({ time })


    onTimeChange(event, time) {
        this.setState({ time });
    }


    render() {

        const { time } = this.state;

        return (
            <div>
                <NavBarDark>      </NavBarDark>
                <Modal>
                    <div class="block">
                        <label>Select Date:</label>
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div class="block">
                        <label>Select Time:</label>
                        <TimeField
                            input={<input type="text" maxlength="5" size="5" value={this.state.name} name="name" onChange={this.onNameChange} />}
                            value={time} onChange={this.onTimeChange} />
                    </div>

                    <div>
                        <input type="text" />
                    </div>

                </Modal>

            </div>

        );
    }
}

export default IncreaseTIme;