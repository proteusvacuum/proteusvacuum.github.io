---
layout: post
title:  "LeetCode: Gas Station Problem"
date:   2017-10-30
tag: code
---

This was a fun problem that took me a little while to solve. The brute force method was quick and easy, but optimizing the solution actually took me a bit of time and re-reading the question until I got it. 

> There are N gas stations along a circular route, where the amount of gas at station i is gas[i].
>
> You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from station i to its next station (i+1). You begin the journey with an empty tank at one of the gas stations.
>
> Return the starting gas station's index if you can travel around the circuit once, otherwise return -1.
>
> Note: The solution is guaranteed to be unique.

My first few attempts failed with a `TimeLimitExceeded` error. 

## Brute Force Method
The brute force method is pretty simple: Start at station X, visit every station once, and if you don't have enough gas to get to the next station, try again starting at station X + 1. This completes in O(n^2) time. 

```python
class Solution(object):

    def canCompleteCircuit(self, gas, cost):
        """
        :type gas: List[int]
        :type cost: List[int]
        :rtype: int
        """
        # complexity O(n^2)
        num_stations = len(gas)
        for start_pos in range(0, num_stations):
            gas_in_car = gas[start_pos]
            for current_pos in range(start_pos, start_pos + num_stations):
                # move to next station
                gas_in_car -= cost[current_pos % num_stations]
                if gas_in_car >= 0:  # did we make it?
                    # get gas from next station
                    gas_in_car += gas[(current_pos + 1) % num_stations]
                else:
                    # we stalled out
                    break
            if gas_in_car >= 0:
                return start_pos
        return -1
```
This returned the correct results, but is obviously not optimal. 

## Greedy implementation
This question was tagged as "greedy" on LeetCode, so I tried writing a greedy implementation which sorted the stations by the largest amount of gas, with the lowest cost next station. In hindsight, this doesn't make that much sense, as this also runs in quadratic time. Starting with the biggest station also doesn't necessarily help us get to the end.

```python
class Solution(object):

    def canCompleteCircuit(self, gas, cost):
        """Greedy implementation
        """
        num_stations = len(gas)
        gas_cost = sorted(zip(gas, cost), key=lambda x: (-x[0], x[1])) # sort by highest gas, and lowest cost
        for start_pos, (starting_gas, starting_cost) in enumerate(gas_cost):
            gas_in_car = starting_gas
            for current_pos in range(start_pos, start_pos + num_stations):
                # move to next station
                gas_in_car -= cost[current_pos % num_stations]
                if gas_in_car >= 0:  # did we make it?
                    # get gas from next station
                    gas_in_car += gas[(current_pos + 1) % num_stations]
                else:
                    # we stalled out
                    break
            if gas_in_car >= 0:
                return start_pos
        return -1
```

This also got the correct answers for all of the tests, but failed with a `TimeLimitExceeded` error.

## Linear time

Thinking about it a bit further, I figured that if you can't get from one position to another without running out of gas, starting somewhere in the middle won't help you get there either. This means we can skip all of these interim steps when checking starting stations. Since the problem is unique, as long as we find a single solution, we know we've found **the** solution.

```python 
class Solution(object):
    
    def canCompleteCircuit(self, gas, cost):
        """O(n) time.

        If we make it to station current_pos, but there isn't enough gas to get to current_pos+1,
        then we know that from start_pos to current_pos aren't any of the starting
        stations, and we can skip all of those between start_pos and current_pos.

        """
        num_stations = len(gas)
        start_pos = current_pos = 0
        gas_in_car = 0
        visited_stations = 0

        while start_pos < num_stations:  # try every station
            if visited_stations >= num_stations:  # we got to every station, so return the starting position
                return start_pos

            # collect gas, and drive to the next station
            gas_in_car += gas[current_pos % num_stations] - cost[current_pos % num_stations]

            if gas_in_car >= 0:  # we made it! go to the next station
                current_pos += 1
                visited_stations += 1
            else:  # we stalled out, empty tank and start again from the next potential position
                gas_in_car = 0
                current_pos += 1
                start_pos = current_pos
                visited_stations = 0

        return -1
```

This solution completed in 32ms, which was within the time limit (and beat 87% of other people's solutions). Hooray!
