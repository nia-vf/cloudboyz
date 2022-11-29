import { Context } from "aws-lambda";
import { ResourceSkus, ComputeManagementClient } from "@azure/arm-compute";
import _ from "lodash";

//Lambda request parameters
interface Event {}
