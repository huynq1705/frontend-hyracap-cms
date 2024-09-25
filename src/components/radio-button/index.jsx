import React from "react";
import get from "lodash/get";

import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

function RadioGroupField(props) {
    const { name, formik, options = [], col } = props;

    return (
        <Grid item md={col || 4} sm={12}>
            <RadioGroup
                {...props}
                aria-label={name}
                value={get(formik.values, name)}
                onChange={formik.handleChange}
            >
                {options.map((item) => {
                    return (
                        <FormControlLabel
                            key={item.value}
                            value={item.value}
                            control={<Radio color="primary" />}
                            label={item.label}
                        />
                    );
                })}
            </RadioGroup>
        </Grid>
    );
}

export default RadioGroupField;
