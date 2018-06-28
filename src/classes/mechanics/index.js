import serialise from 'serialijse';

import BonusMechanic from './BonusMechanic';
import ContainerMechanic from './ContainerMechanic';
import CoreMechanic from './CoreMechanic';
import CostMechanic from './CostMechanic';
import LocationMechanic from './LocationMechanic';
import PowerBonusMechanic from './PowerBonusMechanic';
import ProjectExpiryMechanic from './ProjectExpiryMechanic';
import ProjectGlobalStatCardNum from './ProjectGlobalStatCardNum';
import ProjectGlobalStatPercentBoost from './ProjectGlobalStatPercentBoost';
import ProjectPerCompletionFpbBoost from './ProjectPerCompletionFpbBoost';
import TimeReduceMechanic from './TimeReduceMechanic';
import Unique from './Unique';

serialise.declarePersistable(BonusMechanic);
serialise.declarePersistable(ContainerMechanic);
serialise.declarePersistable(CoreMechanic);
serialise.declarePersistable(CostMechanic);
serialise.declarePersistable(LocationMechanic);
serialise.declarePersistable(PowerBonusMechanic);
serialise.declarePersistable(ProjectExpiryMechanic);
serialise.declarePersistable(ProjectGlobalStatCardNum);
serialise.declarePersistable(ProjectGlobalStatPercentBoost);
serialise.declarePersistable(ProjectPerCompletionFpbBoost);
serialise.declarePersistable(TimeReduceMechanic);
serialise.declarePersistable(Unique);
